import { CgSpinnerTwoAlt } from "react-icons/cg"

interface Props {
  size?: number
}

const Spinner = ({ size }: Props) => (
  <div className="h-full w-full flex justify-center items-center animate-spin">
    <CgSpinnerTwoAlt size={size ?? 30} />
  </div>
)

export default Spinner
