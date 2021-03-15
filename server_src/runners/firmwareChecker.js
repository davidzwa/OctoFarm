const fetch = require("node-fetch");

let lastSuccessfulReleaseCheckMoment = null;
let latestReleaseKnown = null;
let lastReleaseCheckFailed = null;
let lastReleaseCheckError = null;
let loadedWithPrereleases = null;

async function syncLatestOctoFarmRelease(includePrereleases = false) {
  return await fetch(
    "https://api.github.com/repos/octofarm/octofarm/releases",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((body) => {
      if (!!body && body.length > 0) {
        const latestRelease = body.find(
          (r) =>
            r.draft === false && (r.prerelease === false || includePrereleases)
        );

        if (!!latestRelease && !!latestRelease.tag_name) {
          delete latestRelease.body;
          delete latestRelease.author;
          loadedWithPrereleases = includePrereleases;
          lastSuccessfulReleaseCheckMoment = new Date();
          lastReleaseCheckFailed = false;
          latestReleaseKnown = latestRelease;
        } else {
          lastReleaseCheckFailed = true;
        }
      } else {
        lastReleaseCheckFailed = true;
        return null;
      }
    })
    .catch((e) => {
      lastReleaseCheckError = e;
      lastReleaseCheckFailed = true;
      return null;
    });
}

function getLastReleaseSyncState() {
  return {
    latestReleaseKnown,
    lastSuccessfulReleaseCheckMoment,
    lastReleaseCheckFailed,
    loadedWithPrereleases,
    ...(lastReleaseCheckFailed && {lastReleaseCheckError}),
  };
}

function checkReleaseAndLogUpdate() {
  if (!!lastReleaseCheckFailed) {
    console.error(
      "Cant check release as it was not fetched yet or the last fetch failed. Call and await 'syncLatestOctoFarmRelease' first."
    );
    return;
  }
  const latestRelease = getLastReleaseSyncState()?.latestReleaseKnown;
  const latestReleaseTag = latestRelease?.tag_name;
  if (
    !!process.env.npm_package_version &&
    process.env.npm_package_version !== latestReleaseTag
  ) {
    console.log(
      `Installed release: ${process.env.npm_package_version}. Update available!
      New version: ${latestReleaseTag} (prerelease: ${latestRelease.prerelease})
      Release page: ${latestRelease.html_url}`
    );
  } else if (!process.env.npm_package_version) {
    console.error(
      "Cant check release as 'npm_package_version' environment variable is not set. Make sure OctoFarm is run from a 'package.json' or NPM context."
    );
  } else {
    console.log(
      `Installed release: ${process.env.npm_package_version}. You are up to date!`
    );
  }
}

module.exports = {
  syncLatestOctoFarmRelease,
  getLastReleaseSyncState,
  checkReleaseAndLogUpdate,
};
