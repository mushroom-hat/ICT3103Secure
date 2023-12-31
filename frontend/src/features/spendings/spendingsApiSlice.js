import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";


const spendingsAdapter = createEntityAdapter({});


const initialState = spendingsAdapter.getInitialState();


export const spendingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpendings: builder.query({
      query: () => '/spending',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedSpendings = responseData.map((spending) => {
          spending.id = spending._id;
          return spending;
        });
        return spendingsAdapter.setAll(initialState, loadedSpendings);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Spending', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Spending', id })),
          ];
        } else return [{ type: 'Spending', id: 'LIST' }];
      },
    }),
    addNewSpending: builder.mutation({
      query: (initialSpendingData) => ({
        url: '/spending',
        method: 'POST',
        body: {
          ...initialSpendingData,
        },
      }),
      invalidatesTags: [
        { type: 'Spending', id: "LIST" }
      ],
    }),
    getSpendingByOrganization: builder.query({
      query: (organizationId) => ({
        url: '/spending/getByOrg', // Adjust the URL as needed
        method: 'POST', // Use the appropriate HTTP method (POST in this case)
        body: { organizationId }, // Pass the organizationId in the request body
      }),
      providesTags: ['Spending'],
    }),
    // Define additional mutations for updating and deleting spendings as needed.
  }),
});


export const {
  useGetSpendingsQuery,
  useAddNewSpendingMutation,
  useGetSpendingByOrganizationQuery
  // Define additional mutation hooks for updating and deleting spendings as needed.
} = spendingsApiSlice;


// Returns the query result object
export const selectSpendingsResult = spendingsApiSlice.endpoints.getSpendings.select();


// Creates a memoized selector
const selectSpendingsData = createSelector(
  selectSpendingsResult,
  (spendingsResult) => spendingsResult.data // Normalized state object with ids & entities
);


// GetSelectors creates these selectors, and we rename them with aliases using destructuring
export const {
  selectAll: selectAllSpendings,
  selectById: selectSpendingById,
  selectIds: selectSpendingIds,
  // Pass in a selector that returns the spendings slice of state
} = spendingsAdapter.getSelectors((state) => selectSpendingsData(state) ?? initialState);




