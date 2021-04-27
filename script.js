const result = document.getElementById('result')
const search = document.getElementById('search')
const loading = document.createElement('div')
loading.setAttribute('id', 'loading')

function getData(url, query) {
    fetch(`https://api.github.com/${url}?q=${query}`)
        .then(function (response) {
            loading.remove()
            return response.json();
        })
        .then(function (myJson) {
            if (myJson.items.length === 0) {
                let empty = document.createElement('p')
                empty.innerHTML = `We couldn’t find any repositories matching '${query}'`
                result.append(empty)
                return
            }
            let list = document.createElement('ol')
            for (let i = 0; i < myJson.items.length; i++) {
                let li = document.createElement('li')
                let title = document.createElement('h2')
                let link = document.createElement('a')
                let desc = document.createElement('p')
                let detail = document.createElement('div')
                let watchers = document.createElement('div')
                let language = document.createElement('div')
                let created_at = document.createElement('div')

                link.setAttribute('href', myJson.items[i].html_url)
                link.setAttribute('target', '_blank')
                link.setAttribute('class', 'wordbreak')
                desc.setAttribute('class', 'wordbreak')
                detail.setAttribute('class', 'd-flex gap-10')
                watchers.setAttribute('class', 'score')
                language.setAttribute('class', 'type')
                created_at.setAttribute('class', 'time')

                link.innerHTML = myJson.items[i].owner.login + "/" + underline(myJson.items[i].name, query)
                desc.innerHTML = myJson.items[i].description
                watchers.innerHTML = myJson.items[i].watchers
                language.innerHTML = myJson.items[i].language
                created_at.innerHTML = myJson.items[i].created_at

                title.append(link)
                detail.append(watchers, language, created_at)
                li.append(title, desc, detail)
                list.append(li)
                result.append(list)
            }
        });
}

search.addEventListener('change', (e) => {
    result.innerHTML = ''
    result.append(loading)

    let query = e.target.value
    getData('search/repositories', query.toLowerCase())
})

function underline(repo, query) {
    repo = repo.toLowerCase()
    let from = repo.indexOf(query)
    let repo1 = repo.slice(0, from)
    let repo2 = repo.slice(from + query.length)
    let conbine = `${repo1}<em>${query}</em>${repo2}`
    return conbine
}