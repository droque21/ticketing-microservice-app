import "bootstrap/dist/css/bootstrap.css"
import buildClient from "../api/build-client"
import Header from "../components/header"

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  let response = { currentUser: null }
  try {
    const { data } = await client.get("/api/users/currentuser")
    response = data
  } catch (error) {
    console.log(error.message)
  }
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return {
    pageProps,
    ...response,
  }
}

export default AppComponent
