import buildClient from "../api/build-client"

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  let response = {
    currentUser: null,
  }
  try {
    const { data } = await client.get("/api/users/currentuser")
    response = data
  } catch (error) {
    console.log(error.message)
  }

  return response
}

export default LandingPage
