import { FC, ReactNode } from 'react';

interface FormCardProps {
  HeaderTitle: string;
  Content: string;
  children: ReactNode;
}

const FormCard: FC<FormCardProps> = ({ HeaderTitle, Content, children }) => {
  return (
    <div className="group w-[350px] flex flex-col gap-3 items-center justify-center">
      <div className="w-[350px] h-[500px] border border-green-300 group-hover:shadow-box-green-shadow rounded-3xl transition-all duration-300 ease-in-out">
        <div className="bg-[#666] group-hover:bg-white h-32 rounded-t-3xl border-b border-green-300 py-6 px-8 transition-all duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-white group-hover:text-black tracking-wide transition-all duration-300 ease-in-out">
            {HeaderTitle}
          </h3>
          <p className="text-white group-hover:text-black text-base pt-2 pr-4 font-light tracking-wide transition-all duration-300 ease-in-out">
            {Content}
          </p>
        </div>
        <>
          {children}
        </>
      </div>
      <div className="w-20 h-2 border border-green-300 bg-[#D9D9D9] group-hover:bg-green-300 rounded-full group-hover:w-full transition-all duration-500 ease-in-out"></div>
    </div>
  );
};

export default FormCard;
