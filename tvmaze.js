/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

// converts the data from the object to an array

function organizeDataIntoArr(originalObj) {
  const showsArr = [];
  for (const showObj of originalObj) {
    showsArr.push({
      id: showObj.show.id,
      name: showObj.show.name,
      summary: showObj.show.summary,
      image:
        showObj.show.image === null
          ? "https://tinyurl.com/tv-missing"
          : showObj.show.image.medium,
    });
  }
  return showsArr;
}

// call this function with the await keywork to return the value not the promise
// queries the API for data based on the user's search

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const responseFromAPI = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${query}`
  );
  return responseFromAPI.data;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = organizeDataIntoArr(await searchShows(query));

  populateShows(shows);

  $("#search-query").val("");
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

// queries API for episode list based on id
// returns array of all episodes based on ID
async function getEpisodesfromAPI(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above

  const responseFromAPI = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  return responseFromAPI.data;
}

// parses the objects and creates an array with new objects with the requested data
function requestedEpisodeData(arr) {
  const episodeDataArr = [];
  for (const episode of arr) {
    episodeDataArr.push({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    });
  }
  return episodeDataArr;
}

async function populateEpisodes(query) {
  const episodes = requestedEpisodeData(await getEpisodesfromAPI(query));

  const $episodesList = $("#episodes-list");
  $("section").css("display", "initial");
  $episodesList.html("");

  for (const episode of episodes) {
    $episodesList.append(
      $(
        `<li id="${episode.id}">${episode.name} (season ${episode.season}, number: ${episode.number})</li>`
      )
    );
  }
}

$("#shows-list").on("click", ".episodes", async function (e) {
  e.preventDefault();
  const $showID = $(this).parent().parent().attr("data-show-id");
  await populateEpisodes($showID);
});
