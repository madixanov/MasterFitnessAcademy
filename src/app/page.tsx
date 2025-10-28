import Advantages from "./components/Advantages"
import Contacts from "./components/Contacts"
import GallerySlider from "./components/GallerySlider"
import TrainersSlider from "./components/TrainersSlider"
import WelcomingContainer from "./components/Welcoming"

export default function Home() {
  return (
    <main>
        <WelcomingContainer />
        <Advantages />
        <TrainersSlider />
        <GallerySlider />
        <Contacts />
    </main>
  )
}