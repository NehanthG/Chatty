import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast"
import { disconnect } from "mongoose";

import {io} from "socket.io-client"
const BASE_URL=import.meta.env.MODE==="development"
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth", error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true})
        try {
            const res=await axiosInstance.post("/auth/signup",data)
            toast.success("Account Created Successfully!")
            set({authUser:res.data})
            get().connectSocket()

        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("Logged out Successfully")
            get().disconnectSocket()
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message)
            
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try {
            const res  = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            toast.success("Logged in Successfully")

            get().connectSocket()
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message)
        }
        finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data})
            toast.success("Profile Updated Sucessfully")
        } catch (error) {
            console.log("Error in updateProfile", error.message);
            toast.error(error.response.data.message)
        }
        finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser?._id) return;            // Don’t connect if no user
    if (socket?.connected) return;         // Already connected

    // Create socket instance
    const newSocket = io(BASE_URL, {
        query: { userId: authUser._id },
        autoConnect: true,                 // default, but explicit
    });

    // Attach listener BEFORE storing
    newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
},
    disconnectSocket:()=>{
        if(get().socket?.connected){
            get().socket.disconnect()
        }
    }
}));
