import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../helpers/utils/api";

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async ({ auth, postId, reduxCurrentPage, postsPerPage, searchKey }, { rejectWithValue }) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`post/${postId}/comments?page=${reduxCurrentPage}&limit=${postsPerPage}&search=${searchKey}`, 'GET', null, bearerToken);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ auth, postId, comment, parentCommentId = null }, { rejectWithValue }) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${postId}`, 'POST', { comment, parentCommentId }, bearerToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async ({ auth, comment, commentId }, { rejectWithValue }) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`comment/${commentId}`, 'PUT', { comment }, bearerToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const deletedComment  = createAsyncThunk(
    'comments/deleteCOmment',
    async({ auth, commentId}, {rejectWithValue}) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}`};
            const response = await apiRequest(`comment/${commentId}`,'DELETE',null, bearerToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)