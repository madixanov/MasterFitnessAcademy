import Advantages from "./components/Advantages"
import Contacts from "./components/Contacts"
import WelcomingContainer from "./components/Welcoming"

export default function Home() {
  return (
    <main>
        <WelcomingContainer />
        <Advantages />
        <Contacts />
    </main>
  )
}