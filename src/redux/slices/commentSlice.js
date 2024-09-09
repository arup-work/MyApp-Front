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
        commentsPerPage: 5,
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
                const { comment: updatedComment } = action.payload;
            
                // Check if the updated comment has a parentCommentId
                if (updatedComment.parentCommentId) {
                    // It's a child comment, find its parent in reduxComments
                    state.reduxComments = state.reduxComments.map((reduxComment) => {
                        // Find the parent comment to which this child belongs
                        if (reduxComment._id === updatedComment.parentCommentId) {
                            // Update the local state where the children have been fetched and are stored
                            return {
                                ...reduxComment,
                                // Here we assume that if children have been fetched, they're stored in a 'children' array
                                children: reduxComment.children 
                                    ? reduxComment.children.map((childComment) =>
                                          childComment._id === updatedComment._id
                                              ? { ...childComment, comment: updatedComment.comment }
                                              : childComment
                                      )
                                    : reduxComment.children, // If children haven't been fetched yet, leave as is
                            };
                        }
                        return reduxComment; // Return unchanged parent comment
                    });
                } else {
                    // It's a parent comment, update it directly
                    state.reduxComments = state.reduxComments.map((reduxComment) =>
                        reduxComment._id === updatedComment._id
                            ? { ...reduxComment, comment: updatedComment.comment }
                            : reduxComment
                    );
                }
            });
            

    }
})

export const { setCurrentPage } = commentsSlice.actions;
export default commentsSlice.reducer;