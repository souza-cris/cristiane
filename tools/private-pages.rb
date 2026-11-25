#!/usr/bin/env ruby
# frozen_string_literal: true

# Locks and unlocks the private pages (research and teaching).
#
#   bundle exec ruby tools/private-pages.rb lock      _private/ -> _data/locked.json
#   bundle exec ruby tools/private-pages.rb unlock    _data/locked.json -> _private/
#
# Edit the readable files in _private/ (never committed), run `lock`, then
# commit _data/locked.json. `unlock` restores _private/ on another computer.
# Run `lock` again after editing the review game's questions or host screen.

require 'io/console'
require 'openssl'
require 'json'
require 'base64'
require 'fileutils'
require 'jekyll'

ROOT = File.expand_path('..', __dir__)
OUT = File.join(ROOT, '_data/locked.json')
PRIVATE = File.join(ROOT, '_private')
PAGES = %w[research teaching].freeze
ITERATIONS = 600_000
MIN_LENGTH = 16

def ask(prompt)
  return $stdin.gets.to_s.strip unless $stdin.tty?

  $stdin.getpass(prompt).to_s.strip
end

def normal(text)
  text.dup.force_encoding('UTF-8').unicode_normalize(:nfc)
end

def derive(password, salt, iterations)
  OpenSSL::KDF.pbkdf2_hmac(normal(password), salt: salt, iterations: iterations, length: 32, hash: 'SHA256')
end

def encrypt(text, password)
  salt = OpenSSL::Random.random_bytes(16)
  cipher = OpenSSL::Cipher.new('aes-256-gcm').encrypt
  cipher.key = derive(password, salt, ITERATIONS)
  iv = cipher.random_iv
  body = cipher.update(text) + cipher.final + cipher.auth_tag
  { 'iterations' => ITERATIONS }.merge(
    { 'salt' => salt, 'iv' => iv, 'text' => body }.transform_values { |v| Base64.strict_encode64(v) }
  )
end

def decrypt(data, password)
  body = Base64.strict_decode64(data['text'])
  cipher = OpenSSL::Cipher.new('aes-256-gcm').decrypt
  cipher.key = derive(password, Base64.strict_decode64(data['salt']), data['iterations'])
  cipher.iv = Base64.strict_decode64(data['iv'])
  cipher.auth_tag = body[-16..]
  (cipher.update(body[0...-16]) + cipher.final).force_encoding('UTF-8')
end

def lock
  sources = PAGES.to_h do |page|
    path = File.join(PRIVATE, "#{page}.yml")
    abort "Missing #{path} — run `unlock` first to restore it." unless File.exist?(path)
    [page, File.read(path, encoding: 'UTF-8')]
  end

  password = ask("Password (at least #{MIN_LENGTH} characters; several random words is best): ")
  abort "Too short: use at least #{MIN_LENGTH} characters." if password.length < MIN_LENGTH
  abort 'The two passwords do not match.' unless ask('Same password again: ') == password

  Jekyll.logger.log_level = :error
  site = Jekyll::Site.new(Jekyll.configuration('source' => ROOT, 'quiet' => true))
  site.reset
  site.read
  template = File.read(File.join(ROOT, '_includes/private-blocks.html'))

  result = PAGES.to_h do |page|
    payload = site.site_payload
    payload['private'] = YAML.safe_load(sources[page])
    payload['private_page'] = page
    html = site.liquid_renderer.file('private').parse(template)
               .render!(payload, registers: { site: site, page: {} })
    [page, encrypt(JSON.generate('html' => html, 'source' => sources[page]), password)]
  end
  File.write(OUT, "#{JSON.pretty_generate(result)}\n")
  puts 'Locked. Commit _data/locked.json to publish it.'
end

def unlock
  abort 'Nothing has been locked yet.' unless File.exist?(OUT)
  password = ask('Password: ')
  FileUtils.mkdir_p(PRIVATE)
  JSON.parse(File.read(OUT)).each do |page, data|
    source = JSON.parse(decrypt(data, password))['source']
    path = File.join(PRIVATE, "#{page}.yml")
    if File.exist?(path) && File.read(path, encoding: 'UTF-8') != source
      puts "Kept #{path}: it differs from the locked copy. Move it aside to restore."
    else
      File.write(path, source)
      puts "Restored #{path}"
    end
  end
rescue OpenSSL::Cipher::CipherError
  abort 'That password did not work.'
end

case ARGV.first
when 'lock' then lock
when 'unlock' then unlock
else abort 'Use: bundle exec ruby tools/private-pages.rb lock|unlock'
end
