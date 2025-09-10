import {create} from "zustand"
import toast from "react-hot-toast"
import {axiosInstance} from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore.js"
import {io} from "socket.io-client"
export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    
    subscribeToMessages:()=>{
        const {selectedUser} = get()
        if(!selectedUser) return
        const socket = useAuthStore.getState().socket
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId!==selectedUser._id){
                return;
            }
            set({messages:[...get().messages,newMessage]})
        })
    },
    unsubscribeFromMessages:()=>{
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    }
    ,

    getUsers: async()=>{
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.get("/messages/users")
            set({users:res.data})

        } catch (error) {
            console.log("Error in getUsers",error.message);
            toast.error(error.response.data.message)
        }
        finally{
            set({isUsersLoading:false})
        }
    },

    getMessages: async(id)=>{
        set({isMessagesLoading:true})
        try {
            const res = await axiosInstance.get(`/messages/${id}`)
            set({messages:res.data})

        } catch (error) {
            console.log("Error in getMessages",error.message);
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessage:async(messageData)=>{
        const {selectedUser , messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)   
            set({messages:[...messages,res.data]})  
        } catch (error) {
            console.log("Error in sendMessage",error.message);
            toast.error(error.response.data.message)
        }
    }
    ,

    setSelectedUser: (selectedUser)=>set({selectedUser})
}))