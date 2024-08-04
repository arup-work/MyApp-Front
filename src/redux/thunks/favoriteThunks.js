import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../helpers/utils/api";
import { showErrorToast, showSuccessToast } from "../../helpers/utils/toastUtils";

export const addFavoritePost = createAsyncThunk(
    'favorites/addFavoritePost',
    async ({auth, postId}, {rejectWithValue}) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}` };
            const response = await apiRequest(`user/${auth.user.id}/favorites/${postId}`,'POST',null, bearerToken);

            if (response.ok) {
                showSuccessToast('Added to your favorite list');
                return response.data;
            }else{
                showErrorToast('An error occurred');
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const removeFavoritePost = createAsyncThunk(
    'favorites/removeFavoritePost',
    async ({ auth, postId}, {rejectWithValue}) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}`};
            const response = await apiRequest(`user/${auth.user.id}/favorites/${postId}`,'DELETE',null, bearerToken);
            if (response.ok) {
                showSuccessToast('Removed from your favorite list');
                return response.data;
            }else{
                throw new Error('Failed to fetch favorite posts');
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const fetchFavoritePost = createAsyncThunk(
    'favorites/fetchFavoritePost',
    async ({ auth}, {rejectWithValue}) => {
        try {
            const bearerToken = { 'Authorization': `Bearer ${auth.token}`};
            const response = await apiRequest(`user/${auth.user.id}/favorites`,'GET',null, bearerToken);
            if (response.ok) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)