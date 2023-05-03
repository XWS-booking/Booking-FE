import { useEffect, useState } from "react"
import { useApplicationStore } from "../../store/application.store"
import { Button } from "@chakra-ui/react";

export const UserProfilePage = () => {

    const deleteProfile = useApplicationStore(state => state.deleteProfile)
    const deleteProfileRes = useApplicationStore(state => state.deleteProfileRes)

    const handleDeleteProfile = async () =>{
        await deleteProfile()
        console.log(deleteProfileRes)
    }

    return (
        <>
        <Button colorScheme="red" onClick={handleDeleteProfile}>Delete profile</Button>
        </>
    )
}

