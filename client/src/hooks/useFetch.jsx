import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({ keyword }) => {
    const [gifUrl, setGifUrl] = useState("");

    const fetchGifs = async () => {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`); // docs from giphy website
            const { data } = await response.json();

            console.log('success')

            setGifUrl(data[0]?.images?.downsized_medium.url);
        } catch (error) {
            console.log('fail')
            setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
        }
    };

    // called when the keywork from the form input field changes
    useEffect(() => {
        if (keyword) fetchGifs();
    }, [keyword]);

    return gifUrl;
};

export default useFetch;

