import React, {Component} from "react"
import {fetchGQL} from "./lib/fetch-json"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user: null
        }
    }

    componentDidMount = async () => {
        const url = 'https://api.github.com/graphql';
        const query = `query { 
                        user (login: "arcibasheva") {
                          name
                          avatarUrl(size: 150)
                          bio
                        }
                      }
                    `;
        let {user} = await fetchGQL(url, query);
        // console.log(data.body.data.user)
        this.setState({
            user: user,
            loading: false,
        })
    }

    render() {
        let {user, loading} = this.state

        return <div>
            {loading ? <div>Loading...</div> :
                <div>
                    <pre style={{
                        background: 'gray',
                        color: 'white',
                        padding: '10px'
                    }}><code>{JSON.stringify(user, null, '\t')}</code></pre>
                    <hr/>
                    <img src={user.avatarUrl}/>
                    <h4>
                        {user.name}
                    </h4>
                    <p>
                        {user.bio}
                    </p>
                </div>
            }
        </div>
    }
}

export default App