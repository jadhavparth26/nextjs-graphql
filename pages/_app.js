import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { offsetLimitPagination } from '@apollo/client/utilities'

export default function App({ Component, pageProps }) {

  const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            launches: offsetLimitPagination()
          }
        }
      }
    }),
    uri: 'https://spacex-production.up.railway.app/'
  })
  return(
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class" default='dark'>
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  )
}
