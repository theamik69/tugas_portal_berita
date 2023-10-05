
function inputArticles(articleObject) {

    const { source, title, description, url, urlToImage, publishedAt } = articleObject;

    const date = new Date(publishedAt);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const formattedDate = `${months[monthIndex]} ${day} ${year}`;

    const pDescription = document.createElement('p');
    pDescription.classList.add('mt-5', 'line-clamp-3', 'text-sm', 'leading-6', 'text-gray-600');
    pDescription.innerText = description;

    const aTitle = document.createElement('a');
    aTitle.setAttribute('href', url);
    aTitle.innerText = title;

    const hTitle = document.createElement('h3');
    hTitle.classList.add('mt-3', 'text-lg', 'font-semibold', 'leading-6', 'text-gray-900', 'group-hover:text-gray-600');
    hTitle.append(aTitle);

    const divTitleAndDescription = document.createElement('div');
    divTitleAndDescription.classList.add('group', 'relative');
    divTitleAndDescription.append(hTitle, pDescription);

    const aName = document.createElement('a');
    aName.classList.add('relative', 'z-10', 'rounded-full', 'bg-gray-50', 'px-3', 'py-1.5', 'font-medium', 'text-gray-600', 'hover:bg-gray-100');
    aName.setAttribute('href', url);
    aName.innerText = source.name;

    const timeElement = document.createElement('time');
    timeElement.classList.add('text-gray-500');
    timeElement.setAttribute('datetime', date);
    timeElement.innerText = formattedDate;

    const divNameAndTime = document.createElement('div');
    divNameAndTime.classList.add('flex', 'items-center', 'gap-x-4', 'text-xs');
    divNameAndTime.append(timeElement, aName);

    const img = document.createElement('img');
    img.classList.add('h-60', 'w-full', 'object-cover', 'object-center', 'group-hover:opacity-75');
    img.setAttribute('src', urlToImage);

    const divImages = document.createElement('div');
    divImages.classList.add('aspect-h-1', 'aspect-w-1', 'overflow-hidden', 'rounded-lg', 'bg-gray-200', 'xl:aspect-h-8', 'xl:aspect-w-7');
    divImages.append(img);

    const aImage = document.createElement('a');
    aImage.classList.add('group', 'flex', 'justify-center', 'w-full');
    aImage.setAttribute('href', url);
    aImage.append(divImages);

    const article = document.createElement('article');
    article.classList.add('flex', 'max-w-xl', 'flex-col', 'items-start', 'justify-between');
    article.append(aImage, divNameAndTime, divTitleAndDescription);

    return article;
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}



document.addEventListener('DOMContentLoaded', async function () {
    const search = document.getElementById('search-input');
    const articleSpace = document.getElementById('articless');

    async function renderArticles(searchInput) {
        try {
            let articlesArray = [];


            if (searchInput === '') {
                let { articles } = await fetchData("https://newsapi.org/v2/everything?q=bitcoin&apiKey=");

                articlesArray = articles;

            } else {
                let { articles } = await fetchData(`https://newsapi.org/v2/everything?q=${searchInput}&apiKey=`);

                articlesArray = articles;

            }

            articleSpace.innerHTML = '';

            const warning = document.getElementById('warning');

            if (!articlesArray.length) {
                const pWarning = document.createElement('p');
                pWarning.classList.add('text-3xl', 'tracking-widest', 'text-red-100');
                pWarning.innerText = 'Konten tidak ditemukan';

                const divWarning = document.createElement('div');
                divWarning.classList.add('px-6', 'bg-rose-600', 'w-full', 'h-10', 'flex', 'justify-center');
                divWarning.append(pWarning);

                warning.innerHTML = '';
                warning.appendChild(divWarning);
            } else {
                warning.innerHTML = '';
            }

            for (const article of articlesArray) {
                const news = inputArticles(article);
                articleSpace.appendChild(news);
            }
        } catch (error) {
            console.error(error);
        }
    }

    search.addEventListener('input', function () {
        const searchInput = search.value.toLowerCase();
        renderArticles(searchInput);
    });

    renderArticles('');
});