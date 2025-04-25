import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserResponse {
    id: string;
    email: string;
    email_verified?: boolean;
    username: string;
    first_name: string | null;
    second_name: string | null;
    middle_name: string | null;
    phone_number: string | null;
    date_birth: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    description: string | null;
    avatar_id: string | null;
    avatar?: {
        path: string;
    } | null;
}

export type UserUpdateInput = Omit<Partial<UserResponse>, 'id' | 'avatar' | 'avatar_id'>;

type User = UserResponse | null;

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async () => {
        try {
            // return await getUser();
        } catch (error: any) {
            throw new Error('Failed to fetch user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (userData: Partial<UserResponse>) => {
        try {
            // return await updateUserProfile(userData);
        } catch (error) {
            throw new Error('Failed to update user');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
            //     state.loading = false;
            //     state.user = action.payload;
            // })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch user';
            })
            // .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
            //     state.user = action.payload;
            // });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer; 