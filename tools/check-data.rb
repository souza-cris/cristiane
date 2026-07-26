#!/usr/bin/env ruby
# frozen_string_literal: true

# Checks the site's content files for the mistakes that do not announce
# themselves — a missing field that renders as a blank line, a type that does
# not match any known slug, a placeholder someone forgot to replace.
#
#   ruby tools/check-data.rb
#
# Ruby is already required to run Jekyll, and YAML ships with it, so this adds
# nothing to install. It reads files and prints; it never edits anything.
#
# Exit code is 0 when everything is fine and 1 when something needs attention,
# so it can be wired into a git hook later if that is ever wanted.

require 'yaml'
require 'date'

ROOT = File.expand_path('..', __dir__)

$errors = []
$warnings = []

def err(file, where, message, fix = nil)
  $errors << [file, where, message, fix]
end

def warn_at(file, where, message, fix = nil)
  $warnings << [file, where, message, fix]
end

def load_yaml(relative)
  path = File.join(ROOT, relative)
  return nil unless File.exist?(path)

  YAML.load_file(path, permitted_classes: [Date, Time], aliases: true)
rescue Psych::SyntaxError => e
  err(relative, "line #{e.line}", "the file is not valid YAML: #{e.problem}",
      'usually a stray quote, a tab used for indentation, or a missing colon')
  nil
end

# Reads the slugs a filter file allows, e.g. paper / book / talk.
def slugs(relative)
  data = load_yaml(relative)
  return [] unless data.is_a?(Array)

  data.filter_map { |e| e['slug'] if e.is_a?(Hash) }
end

# Fields that may legitimately be empty — leaving them blank is a real choice,
# and the templates render nothing at all rather than an empty element.
ALLOWED_EMPTY = %w[note logo url summary deadline tags period title].freeze

# Fields that hold sentences. Only these get the placeholder check: `short` is
# initials and `flag` is a single emoji, so "shortness" means nothing there.
PROSE = %w[note tldr whyItMatters keyTakeaway description blurb involves
           eligibility title org place label].freeze

# A prose value that is present but obviously unfinished — "." or "tbd".
def placeholder?(field, value)
  return false unless PROSE.include?(field) && value.is_a?(String)

  stripped = value.strip
  return false if stripped.empty? # empty is a legitimate "leave this out"

  stripped.length < 3 || %w[tbd todo xxx n/a na].include?(stripped.downcase)
end

# Optional fields are never required, so check_required never sees them — but an
# optional field left as "." still renders. This catches those.
def check_optional_prose(file, where, entry)
  return unless entry.is_a?(Hash)

  entry.each do |field, value|
    next unless placeholder?(field, value)

    warn_at(file, where, "`#{field}` is #{value.strip.inspect} — is that finished?",
            'use "" to leave it out entirely; a stray placeholder renders on the page')
  end
end

def check_required(file, where, entry, fields)
  fields.each do |field|
    value = entry[field]
    if value.nil?
      err(file, where, "`#{field}` is missing",
          "add `#{field}:` — leaving it out is not the same as leaving it empty")
    elsif value.is_a?(String) && value.strip.empty? && !ALLOWED_EMPTY.include?(field)
      err(file, where, "`#{field}` is empty", 'this field needs a value')
    elsif placeholder?(field, value)
      warn_at(file, where, "`#{field}` is #{value.strip.inspect} — is that finished?",
              'use "" to leave it out entirely; a stray placeholder renders on the page')
    end
  end
end

# ---------------------------------------------------------------- bookmarks

def check_bookmarks
  file = '_data/bookmarks.yml'
  entries = load_yaml(file)
  return unless entries.is_a?(Array)

  allowed = slugs('_data/bookmark_types.yml')
  entries.each_with_index do |entry, i|
    where = entry['title'] ? "\"#{entry['title']}\"" : "entry #{i + 1}"
    check_required(file, where, entry,
                   %w[title type whyItMatters keyTakeaway link addedDate source])
    check_optional_prose(file, where, entry)

    type = entry['type']
    if type && !allowed.include?(type)
      near = allowed.min_by { |s| levenshtein(type.to_s, s) }
      err(file, where, "type #{type.inspect} is not a known slug",
          "use one of: #{allowed.join(', ')}#{" — did you mean \"#{near}\"?" if near}")
    end

    tags = entry['topicTags']
    if tags.nil?
      err(file, where, '`topicTags` is missing', 'add at least one topic tag')
    elsif !tags.is_a?(Array)
      err(file, where, '`topicTags` must be a list',
          'write it as indented "- " lines beneath topicTags:')
    elsif tags.empty?
      warn_at(file, where, '`topicTags` is an empty list', 'add a tag or remove the field')
    end

    check_date(file, where, entry['addedDate'], 'addedDate')
    check_link(file, where, entry['link'], 'link')
  end
end

# ----------------------------------------------------------------- journey

def check_journey
  file = '_data/journey.yml'
  entries = load_yaml(file)
  return unless entries.is_a?(Array)

  entries.each_with_index do |entry, i|
    where = entry['org'] ? "\"#{entry['org']}\"" : "entry #{i + 1}"

    # `label` is what the track renders. Losing it is invisible here and
    # obvious on the page, which is exactly why it is checked first.
    check_required(file, where, entry, %w[category label org short flag place])
    check_optional_prose(file, where, entry)

    category = entry['category']
    if category && !%w[academia industry].include?(category)
      err(file, where, "category #{category.inspect} is not academia or industry",
          'the badge ring colour and style come from this')
    end

    logo = entry['logo']
    if logo && !logo.to_s.empty?
      path = File.join(ROOT, 'assets/img/logos', logo)
      unless File.exist?(path)
        err(file, where, "logo file `assets/img/logos/#{logo}` does not exist",
            'commit the file, or set logo: "" to fall back to the initials')
      end
    end

    check_link(file, where, entry['url'], 'url') if entry['url']
  end
end

# ------------------------------------------------------------------ others

def check_sections
  file = '_data/sections.yml'
  entries = load_yaml(file)
  return unless entries.is_a?(Array)

  entries.each_with_index do |entry, i|
    where = entry['label'] ? "\"#{entry['label']}\"" : "entry #{i + 1}"
    check_required(file, where, entry, %w[label url match])

    match = entry['match']
    if match && !%w[exact prefix].include?(match)
      err(file, where, "match #{match.inspect} must be exact or prefix",
          'prefix also highlights child pages, exact does not')
    end

    url = entry['url'].to_s
    if !url.empty? && (!url.start_with?('/') || url.start_with?('/cristiane'))
      err(file, where, "url #{url.inspect} should be site-rooted without the base path",
          'write "/stories", not "/cristiane/stories" — the base path is added for you')
    end
  end
end

def check_social
  file = '_data/social.yml'
  entries = load_yaml(file)
  return unless entries.is_a?(Array)

  footer = File.join(ROOT, '_includes/footer.html')
  drawn = File.exist?(footer) ? File.read(footer).scan(/when '([a-z]+)'/).flatten : []

  entries.each_with_index do |entry, i|
    where = entry['label'] ? "\"#{entry['label']}\"" : "entry #{i + 1}"
    check_required(file, where, entry, %w[label url icon])
    check_link(file, where, entry['url'], 'url')

    icon = entry['icon']
    if icon && !drawn.empty? && !drawn.include?(icon)
      err(file, where, "icon #{icon.inspect} has no drawing in _includes/footer.html",
          "drawings available: #{drawn.join(', ')} — a new service needs its icon added there")
    end
  end
end

def check_updates
  file = '_data/updates.yml'
  entries = load_yaml(file)
  return unless entries.is_a?(Array)

  entries.each_with_index do |entry, i|
    where = entry['title'] ? "\"#{entry['title']}\"" : "entry #{i + 1}"
    check_required(file, where, entry, %w[type title date link])
    check_optional_prose(file, where, entry)
    check_date(file, where, entry['date'], 'date')

    link = entry['link'].to_s
    if link.start_with?('/cristiane')
      err(file, where, "link #{link.inspect} includes the base path",
          'write "/research/", not "/cristiane/research/"')
    end
  end
end

def check_study
  file = '_data/study.yml'
  study = load_yaml(file)
  return unless study.is_a?(Hash)

  return unless study['active']

  check_required(file, 'study', study,
                 %w[title description eligibility involves action_label action_url])
  url = study['action_url'].to_s
  unless url.start_with?('http://', 'https://', 'mailto:')
    err(file, 'study', "action_url #{url.inspect} is not a complete address",
        'it needs https:// or mailto: at the front, or it will not work as a link')
  end
end

def check_posts
  allowed = slugs('_data/story_keywords.yml')
  Dir[File.join(ROOT, '_posts', '*.md')].sort.each do |path|
    rel = "_posts/#{File.basename(path)}"
    raw = File.read(path)
    unless raw.start_with?('---')
      err(rel, 'top of file', 'no front matter block',
          'the file must open with --- and close the block with ---')
      next
    end

    front_raw = raw.split(/^---\s*$/)[1]
    front = begin
      YAML.safe_load(front_raw, permitted_classes: [Date, Time])
    rescue Psych::SyntaxError => e
      err(rel, 'front matter', "not valid YAML: #{e.problem}")
      next
    end

    check_required(rel, 'front matter', front, %w[layout title date tldr])
    check_optional_prose(rel, 'front matter', front)

    keywords = front['keywords']
    if keywords.nil?
      warn_at(rel, 'front matter', '`keywords` is missing',
              'the story will not appear under any filter')
    elsif !keywords.is_a?(Array)
      err(rel, 'front matter', '`keywords` must be a list', 'write it as [ai, leadership]')
    else
      keywords.each do |k|
        next if allowed.include?(k)

        near = allowed.min_by { |s| levenshtein(k.to_s, s) }
        err(rel, 'front matter', "keyword #{k.inspect} is not a known slug",
            "use one of: #{allowed.join(', ')}#{" — did you mean \"#{near}\"?" if near}")
      end
    end

    # The filename date is what Jekyll uses for the URL; a mismatch is confusing.
    if (m = File.basename(path).match(/^(\d{4}-\d{2}-\d{2})-/))
      fm_date = front['date'].is_a?(Date) || front['date'].is_a?(Time) ? front['date'].strftime('%Y-%m-%d') : front['date'].to_s[0, 10]
      if fm_date != m[1] && !fm_date.empty?
        warn_at(rel, 'front matter', "date #{fm_date} does not match the filename date #{m[1]}",
                'the filename decides the URL; the front matter date decides the order')
      end
    end
  end
end

# ----------------------------------------------------------------- helpers

def check_date(file, where, value, field)
  return if value.nil?

  text = value.is_a?(Date) || value.is_a?(Time) ? value.strftime('%Y-%m-%d') : value.to_s
  return if text.match?(/^\d{4}-\d{2}-\d{2}$/)

  err(file, where, "#{field} #{value.inspect} is not a date",
      'write it as YYYY-MM-DD, for example 2026-07-26')
end

PLACEHOLDER_HOSTS = %w[example.com example.org example.net].freeze

def check_link(file, where, value, field)
  return if value.nil? || value.to_s.empty?

  text = value.to_s
  unless text.start_with?('http://', 'https://', 'mailto:')
    err(file, where, "#{field} #{value.inspect} is not a complete address",
        'external links need https:// at the front')
    return
  end

  # A link that parses fine and goes nowhere. These reach visitors.
  return unless PLACEHOLDER_HOSTS.any? { |h| text.include?(h) }

  err(file, where, "#{field} points at #{value.inspect}",
      'example.com is a placeholder — this link is live and broken for visitors')
end

def levenshtein(a, b)
  d = Array.new(a.length + 1) { |i| [i] + Array.new(b.length, 0) }
  (0..b.length).each { |j| d[0][j] = j }
  (1..a.length).each do |i|
    (1..b.length).each do |j|
      cost = a[i - 1] == b[j - 1] ? 0 : 1
      d[i][j] = [d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost].min
    end
  end
  d[a.length][b.length]
end

# -------------------------------------------------------------------- run

# Each check knows which file it owns, so a caller can ask for a subset. The
# git hook passes the staged files, so a problem in a file you are not touching
# does not block a commit that has nothing to do with it.
CHECKS = {
  '_data/bookmarks.yml' => method(:check_bookmarks),
  '_data/journey.yml' => method(:check_journey),
  '_data/sections.yml' => method(:check_sections),
  '_data/social.yml' => method(:check_social),
  '_data/updates.yml' => method(:check_updates),
  '_data/study.yml' => method(:check_study),
  '_posts' => method(:check_posts)
}.freeze

requested = ARGV.reject { |a| a.start_with?('-') }
scoped = !requested.empty?

if scoped
  ran = CHECKS.select { |owned, _| requested.any? { |f| f.include?(owned) } }
  # A filter file changing can invalidate entries elsewhere, so widen for those.
  ran = CHECKS if requested.any? { |f| f.include?('_keywords') || f.include?('_types') }
  ran.each_value(&:call)
else
  CHECKS.each_value(&:call)
end

def report(title, items, symbol)
  return if items.empty?

  puts "\n#{title}"
  items.group_by(&:first).each do |file, rows|
    puts "\n  #{file}"
    rows.each do |(_, where, message, fix)|
      puts "    #{symbol} #{where}: #{message}"
      puts "      -> #{fix}" if fix
    end
  end
end

report('PROBLEMS — these will show on the page, or drop content', $errors, 'x')
report('WORTH A LOOK — probably fine, but check', $warnings, '?')

puts
if $errors.empty? && $warnings.empty?
  puts 'All content files look good.'
elsif $errors.empty?
  puts "No problems. #{$warnings.length} thing#{'s' if $warnings.length != 1} worth a look."
else
  puts "#{$errors.length} problem#{'s' if $errors.length != 1} to fix" \
       "#{", #{$warnings.length} worth a look" unless $warnings.empty?}."
end
puts

exit($errors.empty? ? 0 : 1)
