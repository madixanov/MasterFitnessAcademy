import MainContainer from "@/components/MainContainer";
import ProductContainer from "@/components/UI/ProductContainer";

const seminars = [
  {id: 1, name: "ТЕКСТ", image: "/seminars/seminar1.jpg"},
  {id: 2, name: "ТЕКСТ", image: "/seminars/seminar2.jpg"},
  {id: 3, name: "ТЕКСТ", image: "/seminars/seminar4.jpg"},
  {id: 4, name: "ТЕКСТ", image: "/seminars/seminar3.jpg"},
  {id: 5, name: "ТЕКСТ", image: "/seminars/seminar4.jpg"},
  {id: 6, name: "ТЕКСТ", image: "/seminars/seminar2.jpg"},
  {id: 7, name: "ТЕКСТ", image: "/seminars/seminar5.jpg"},
  {id: 8, name: "ТЕКСТ", image: "/seminars/seminar6.jpg"},
  {id: 9, name: "ТЕКСТ", image: "/seminars/seminar3.jpg"},
]

export default function Seminars() {
  return (
    <main className="flex justify-center items-center relative bg-[url('/courses/bg-photo.jpg')] bg-center bg-cover bg-no-repeat py-25 lg:py-30 xl:py-40 min-h-[calc(100vh-140px)] w-full">
      <div className="absolute inset-0 bg-black/60"></div>

      <MainContainer>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {seminars.map((seminar) => (
            <ProductContainer key={seminar.id} title="Семинары" description={seminar.name} image={seminar.image} />
          ))}
        </section>
      </MainContainer>
    </main>
  )
}