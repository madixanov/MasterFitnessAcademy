export default function EnrollForm() {
  return (
    <form className="flex flex-col bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-lg w-full">
      <h2>Ваши данные</h2>
      <label htmlFor="name" className="mb-5 flex flex-col gap-1">
        Полное имя
        <input type="text" id="name" placeholder="Иван Петров" className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none" />
      </label>

      <label htmlFor="phone" className="mb-5 flex flex-col gap-1">
        Номер телефона
        <input type="phone" id="phone" placeholder="+998 " className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none" />
      </label>

      <label htmlFor="email" className="mb-5 flex flex-col gap-1">
        Email
        <input type="email" id="phone" placeholder="example@mail.com" className="border border-[#2A2A2A] px-5 py-2 rounded-md focus:outline-none" />
      </label>

      <button className="flex justify-center items-center w-full bg-[#FF7A00] py-2 rounded-lg mt-7">Отправить заявку</button>
    </form>
  )
}