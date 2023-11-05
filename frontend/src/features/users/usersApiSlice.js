import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const User = require('./User'); // Import your User model
const Card = require('../cards/Card'); // Import your User model

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id }))
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    getOrganizations: builder.query({
      query: () => "/users/organizations",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedOrganizations = responseData.map((org) => ({
          id: org._id,
          username: org.username,
        }));
        return loadedOrganizations;
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return result.map((org) => ({ type: "Organization", id: org.id }));
        } else return [{ type: "Organization", id: "LIST" }];
      },
    }),
    getUserById: builder.query({
      query: (id) => `/users/getUserById/${id}`,  // Include the 'id' as a parameter in the URL
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      }
    }),
    getUserByUsername: builder.query({
      query: (username) => ({
        url: '/users/getUserByUsername',
        method: 'POST',
        body: { username },
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
        // console.log('Original response data:', responseData);
      
        // Define the structure of the data you expect in the response
        const expectedDataStructure = {
          name: '',
          username: '',
          email: '',
          card: 'null',
        };
      
        // Extract data from the original response and provide defaults if not present
        const transformedData = {
          name: responseData?.user?.name || expectedDataStructure.name,
          username: responseData?.user?.username || expectedDataStructure.username,
          email: responseData?.user?.email || expectedDataStructure.email,
          card: responseData?.user?.card || expectedDataStructure.card,
        };
      
        // console.log('Transformed response data:', transformedData);
      
        return transformedData;
      },

    }),
    

  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetOrganizationsQuery,
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
} = usersApiSlice;

// Returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// Creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// GetSelectors creates these selectors and renames them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
