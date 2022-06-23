const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fetch(`https://ctftime.org/api/v1/events/?limit=2&start=1655919309&finish=1656610509`)
            
            .then(res => {
                return res.json();})
            .then(data =>  console.log(data[1]))