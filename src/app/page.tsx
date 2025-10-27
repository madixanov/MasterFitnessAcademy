import Advantages from "./components/Advantages"
import Contacts from "./components/Contacts"
import GallerySlider from "./components/GallerySlider"
import WelcomingContainer from "./components/Welcoming"

export default function Home() {
  return (
    <main>
        <WelcomingContainer />
        <Advantages />
        <GallerySlider />
        <Contacts />
    </main>
  )
}