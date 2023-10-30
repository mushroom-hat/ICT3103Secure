import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const articlesAdapter = createEntityAdapter({})

const initialArticleState = articlesAdapter.getInitialState()

export const articlesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getArticles: builder.query({
            query: () => '/articles',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedArticles = responseData.map(article => {
                    article.id = article._id
                    return article
                });
                return articlesAdapter.setAll(initialArticleState, loadedArticles)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Article', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Article', id }))
                    ]
                } else return [{ type: 'Article', id: 'LIST' }]
            }
        }),
        addNewArticle: builder.mutation({
            query: initialArticleData => ({
                url: '/articles',
                method: 'POST',
                body: {
                    ...initialArticleData,
                }
            }),
            invalidatesTags: [
                { type: 'Article', id: "LIST" }
            ]
        }),
        updateArticle: builder.mutation({
            query: initialArticleData => ({
                url: `/articles/${initialArticleData.id}`,
                method: 'PATCH',
                body: {
                    ...initialArticleData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Article', id: arg.id }
            ]
        }),
        deleteArticle: builder.mutation({
            query: ({ id }) => ({
                url: `/articles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Article', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetArticlesQuery,
    useAddNewArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
} = articlesApiSlice

// returns the query result object
export const selectArticlesResult = articlesApiSlice.endpoints.getArticles.select()

// creates a memoized selector
const selectArticlesData = createSelector(
    selectArticlesResult,
    articlesResult => articlesResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllArticles,
    selectById: selectArticleById,
    selectIds: selectArticleIds
    // Pass in a selector that returns the articles slice of state
} = articlesAdapter.getSelectors(state => selectArticlesData(state) ?? initialArticleState)
