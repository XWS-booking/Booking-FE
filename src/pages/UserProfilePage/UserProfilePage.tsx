import { useEffect, useState } from "react"
import { useApplicationStore } from "../../store/application.store"
import { Button, useToast } from "@chakra-ui/react";
import { displayToast } from "../../utils/toast.caller";
import { useNavigate } from "react-router";

export const UserProfilePage = () => {

    const deleteProfile = useApplicationStore(state => state.deleteProfile)
    const deleteProfileRes = useApplicationStore(state => state.deleteProfileRes)
    const logout = useApplicationStore(state => state.logout)
    const toast = useToast()
    const navigate = useNavigate();

    const handleDeleteProfile = async () => {
        const res = await deleteProfile()
        if (res.deleted) {
            displayToast(toast, res.message, "success")
            await logout()
            navigate("/");
        }
        else 
            displayToast(toast, res.message, "error")
    }


    return (
        <>
        <Button colorScheme="red" onClick={handleDeleteProfile}>Delete profile</Button>
        </>
    )
}

