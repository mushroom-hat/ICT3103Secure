import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const donationsAdapter = createEntityAdapter({})

const initialState = donationsAdapter.getInitialState()

export const donationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDonations: builder.query({
            query: () => '/donations',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                // Modify the transformation logic as needed
                return donationsAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Donation', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Donation', id }))
                    ]
                } else return [{ type: 'Donation', id: 'LIST' }]
            }
        }),
        addNewDonation: builder.mutation({
            query: initialDonationData => ({
                url: '/donations',
                method: 'POST',
                body: {
                    ...initialDonationData,
                }
            }),
            invalidatesTags: [
                { type: 'Donation', id: "LIST" }
            ]
        }),
        deleteDonation: builder.mutation({
            query: ({ id }) => ({
                url: `/donations`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Donation', id: arg.id }
            ],
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Donation', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Donation', id }))
                    ]
                } else return [{ type: 'Donation', id: 'LIST' }]
            }
        }),
        getDonationsByOrganization: builder.query({
            query: (organizationId) => ({
                url: '/donations/getByOrg',
                method: 'POST',
                body: { organizationId }, // Pass the organizationId in the request body
            }),
            providesTags: ['Donation'],
        }),
    }),
})


export const {
    useGetDonationsQuery,
    useAddNewDonationMutation,
    useDeleteDonationMutation,
    useGetDonationsByOrganizationQuery
} = donationsApiSlice

// Returns the query result object
export const selectDonationsResult = donationsApiSlice.endpoints.getDonations.select()

// Creates a memoized selector
const selectDonationsData = createSelector(
    selectDonationsResult,
    donationsResult => donationsResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDonations,
    selectById: selectDonationById,
    selectIds: selectDonationIds
} = donationsAdapter.getSelectors(state => selectDonationsData(state) ?? initialState)
