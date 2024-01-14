export const getBeer = async (name) => {
    return await fetch(`https://api.punkapi.com/v2/beers?beer_name=${name}&per_page=10`)
            .then((response) => response.json());
}



