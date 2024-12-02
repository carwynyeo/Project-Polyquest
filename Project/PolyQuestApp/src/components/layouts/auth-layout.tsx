interface Props {
  children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <div className="relative hidden w-1/2 h-screen lg:flex justify-center items-center bg-cover bg-center bg-[url('/images/books.jpg')] ">
        <div className="absolute h-screen w-full bg-black opacity-80 z-10"></div>

        <div className=" max-w-[500px] text-white z-20 text-lg space-y-2">
          <p>
            &quot;Discover personalised course and career recommendations based
            on your academic interest and strengths. Take our interactive test
            to find the perfect polytechnic programs and chart your path to
            success!&quot;
          </p>

          <p>— Khoo Ze Kang</p>
        </div>
      </div>

      <div className="flex justify-center items-center p-5 w-full lg:w-1/2">
        <div className="max-w-[500px] w-full">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
