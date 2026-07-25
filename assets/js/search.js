// Filters a list on the page as you type. No libraries, no build step.
// The input says which list to filter via its data-search-list attribute.
(function () {
  var input = document.querySelector("[data-search-list]");
  if (!input) return;

  var list = document.querySelector(input.getAttribute("data-search-list"));
  if (!list) return;

  var items = Array.prototype.slice.call(list.children);
  var noMatches = document.querySelector("[data-search-empty]");

  // The box is hidden in the HTML and revealed here, so it never shows up
  // as a dead input for visitors whose browser blocks JavaScript.
  input.closest(".search").hidden = false;

  input.addEventListener("input", function () {
    var query = input.value.trim().toLowerCase();
    var visible = 0;

    items.forEach(function (item) {
      var matches =
        query === "" || item.textContent.toLowerCase().indexOf(query) !== -1;
      item.hidden = !matches;
      if (matches) visible++;
    });

    if (noMatches) noMatches.hidden = visible !== 0 || query === "";
  });
})();
