import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
     //TODO: create playlist
    if (!name || !description) {
      throw new ApiError(400, "Name and description are required");
    }
    const playlist = await Playlist.create({
      name,
      description,
      owner: req.user?._id,
    });
    if (!playlist) {
      throw new ApiError(500, "Error while creating playlist");
    }
    return res
      .status(200)
      .json(new ApiRes(201, playlist, "Playlist created successfully"));

   
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId");
      }
      const playlist = await Playlist.findOne({ _id: playlistId }).populate({
        path: "videos",
        populate: { path: "owner", select: "username fullName avatar" },
      });
      if (!playlist) {
        throw new ApiError(404, "Playlist not found");
      }
      return res
        .status(200)
        .json(new ApiRes(200, playlist, "Playlist fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId");
      }
      const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user?._id,
      });
      if (!deletedPlaylist) {
        throw new ApiError(500, "Unable to delete, please try later");
      }
      return res.status(200).json(new ApiRes(200, {}, "Deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}