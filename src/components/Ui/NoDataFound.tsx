import React from 'react';
import clsx from 'clsx';
import MenuIcon from '../../lib/MenuIcon';

interface NoDataFoundProps {
  className?: string;
  message?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  className = '',
  message = 'No Data Found',
}) => {
  return (
    <div
      className={clsx(
        'sm:text-[28px] text-[20px] 2xl:text-[32px] font-semibold text-gray-400 text-center my-8 py-8',
        className
      )}
    >
      <MenuIcon name="noData" className="w-[60px] h-[60px] text-gray-400 text-center mx-auto my-[10px]"/>
      {message}
    </div>
  );
};

export default NoDataFound;
