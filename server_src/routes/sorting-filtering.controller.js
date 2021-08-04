const { createController } = require("awilix-express");
const { ensureAuthenticated } = require("../middleware/auth");

class SortingFilteringController {
  #sortingFilteringCache;

  constructor({ sortingFilteringCache }) {
    this.#sortingFilteringCache = sortingFilteringCache;
  }

  updateFilter(req, res) {
    this.#sortingFilteringCache.updateFilter(req.params.filter);
    res.sendStatus(200);
  }

  updateSorting(req, res) {
    this.#sortingFilteringCache.updateSorting(req.params.sorting);
    res.sendStatus(200);
  }
}

// prettier-ignore
module.exports = createController(SortingFilteringController)
  .prefix("/client")
  .before([ensureAuthenticated])
  .get("/updateFilter/:filter", "updateFilter")
  .get("/updateSorting/:sorting", "updateSorting");