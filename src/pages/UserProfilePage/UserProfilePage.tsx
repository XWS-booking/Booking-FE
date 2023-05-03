import { useEffect, useState } from "react"
import { useApplicationStore } from "../../store/application.store"
import { Button, Flex, Spinner, useToast } from "@chakra-ui/react";
import { displayToast } from "../../utils/toast.caller";
import { useNavigate } from "react-router";

export const UserProfilePage = () => {

    const deleteProfile = useApplicationStore(state => state.deleteProfile)
    const deleteProfileRes = useApplicationStore(state => state.deleteProfileRes)
    const logout = useApplicationStore(state => state.logout)
    const toast = useToast()
    const navigate = useNavigate();
    const [startedDeletion, setStartedDeletion] = useState<boolean>(false)

    const handleDeleteProfile = async () => {
        await deleteProfile()
    }

    useEffect(() => {
        if(deleteProfileRes.status === "SUCCESS") {
            displayToast(toast, "Successfully deleted profile!", "success")
            return
        }
        if(deleteProfileRes.status === "ERROR") {
            displayToast(toast, deleteProfileRes.error ?? "", "error")
        }
    }, [deleteProfileRes])


    return (
        <>
        <Button colorScheme="red" onClick={handleDeleteProfile}>
            {!startedDeletion && <p>Delete profile</p>}
            {startedDeletion &&
                <Flex justifyContent='center'>
                    <Spinner size='lg' />
                </Flex>}
        </Button>
        </>
    )
}

