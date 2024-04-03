import { useEffect, useState } from "react";
import { getMembers } from "../../lib/fetch";

export const useMembers = () => {
    const [members, setMembers] = useState([])
    const fetchMembers = async () => {
        const response = getMembers()
        if (response && response.data) setMembers(response.data);

    };

    useEffect(() => {
        fetchMembers().then((members => console.log(members)))

    }, [])

    return { members };
}