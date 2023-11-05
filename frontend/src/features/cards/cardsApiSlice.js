import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const cardsAdapter = createEntityAdapter({})

const initialCardState = cardsAdapter.getInitialState()

export const cardsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCards: builder.query({
            query: () => '/cards',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedCards = responseData.map(card => {
                    card.id = card._id
                    return card
                });
                return cardsAdapter.setAll(initialCardState, loadedCards)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Card', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Card', id }))
                    ]
                } else return [{ type: 'Card', id: 'LIST' }]
            }
        }),
        addNewCard: builder.mutation({
            query: initialCardData => ({
                url: '/cards',
                method: 'POST',
                body: {
                    ...initialCardData,
                }
            }),
            invalidatesTags: [
                { type: 'Card', id: "LIST" }
            ]
        }),
        updateCard: builder.mutation({
            query: initialCardData => ({
                url: `/cards/${initialCardData.id}`,
                method: 'PATCH',
                body: {
                    ...initialCardData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Card', id: arg.id }
            ]
        }),
        deleteCard: builder.mutation({
            query: ({ id }) => ({
                url: `/cards`,
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Card', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetCardsQuery,
    useAddNewCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
} = cardsApiSlice

// returns the query result object
export const selectCardsResult = cardsApiSlice.endpoints.getCards.select()

// creates memoized selector
const selectCardsData = createSelector(
    selectCardsResult,
    cardsResult => cardsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCards,
    selectById: selectCardById,
    selectIds: selectCardIds
    // Pass in a selector that returns the cards slice of state
} = cardsAdapter.getSelectors(state => selectCardsData(state) ?? initialCardState)
