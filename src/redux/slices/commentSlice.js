import { createSlice } from "@reduxjs/toolkit";
import { addComment, fetchComments, updateComment } from "../thunks/commentsThunks";

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        reduxComments: [],
        reduxTotalComments: 0,
        reduxPost: {},
        reduxCurrentPage: 1,
        reduxTotalPages: 1,
        commentsPerPage:5,
        status: 'idle',
        error: null
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.reduxCurrentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.reduxPost = action.payload.post;
                state.reduxComments = action.payload.comments;
                state.reduxTotalComments = action.payload.totalComments;
                state.reduxTotalPages = action.payload.totalPages;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { comment } = action.payload;
                const commentsPerPage = state.commentsPerPage; // Ensure commentsPerPage is available in the state

                // Check if the comment is a reply
                if (comment.parentCommentId) {
                    // Find the parent comment in the list
                    const parentComment = state.reduxComments.find(
                        eachComment => eachComment._id === comment._id
                    );

                    if (parentComment) {
                        // Update the replies of the parent comment
                        if (!parentComment.replies) {
                            parentComment.replies = [];
                        }
                        parentComment.replies.push(comment);
                    }
                } else {
                    // If it's a new comment (not a reply), prepend it to the list
                    state.reduxComments = [comment, ...state.reduxComments];

                     // If the number of comments exceeds the limit per page, remove the last comment
                    if (state.reduxComments.length > commentsPerPage) {
                        state.reduxComments.pop();  // Remove the oldest comment to maintain the limit
                    }
                }

                // Increase the total comment count
                state.reduxTotalComments += 1;

                // Recalculate total pages
                state.reduxTotalPages = Math.ceil(state.reduxTotalComments / commentsPerPage);


            })

            .addCase(updateComment.fulfilled, (state, action) => {
                const { comment : newComment } = action.payload;
               
                state.reduxComments = state.reduxComments.map(reduxComment =>
                    reduxComment._id === newComment._id
                        ? { ...reduxComment, comment: newComment.comment }
                        : reduxComment
                );
            })
    }
})

export const { setCurrentPage } = commentsSlice.actions;
export default commentsSlice.reducer;