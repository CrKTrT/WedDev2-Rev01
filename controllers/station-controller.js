import { playlistStore } from "../models/playlist-store.js";
import { trackStore } from "../models/track-store.js";
import { playlistAnalytics } from "../utils/playlist-analytics.js";

export const playlistController = {
  async index(request, response) {
    const playlist = await playlistStore.getPlaylistById(request.params.id);
    const shortestTrack = playlistAnalytics.getShortestTrack(playlist);
    const viewData = {
      title: "Playlist",
      playlist: playlist,
      shortestTrack: shortestTrack,
    };
    response.render("playlist-view", viewData);
  },

  async addTrack(request, response) {
    const playlist = await playlistStore.getPlaylistById(request.params.id);
    const newTrack = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`adding track ${newTrack.title}`);
    await trackStore.addTrack(playlist._id, newTrack);
    response.redirect("/playlist/" + playlist._id);
  },

  async deleteTrack(request, response) {
    const playlistId = request.params.playlistid;
    const trackId = request.params.trackid;
    console.log(`Deleting Track ${trackId} from Playlist ${playlistId}`);
    await trackStore.deleteTrack(request.params.trackId);
    response.redirect("/playlist/" + playlistId);
  },
};
