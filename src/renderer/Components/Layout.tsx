import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack as BackIcon } from 'react-icons/io';
import ControllerStatus from './ControllerStatus';
import InputEvent from '../input';

export default function Layout({
  children,
  title,
  back = false, // controller = false,
}: {
  children: React.ReactNode;
  title: string;
  back?: boolean;
  // controller?: boolean;
}) {
  const backRef = React.useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!back) return;
    InputEvent.on('back', () => backRef.current?.click());
  }, [back]);

  return (
    <>
      <header>
        {back && (
          <Link ref={backRef} to="/">
            <BackIcon size={24} />
            <p>Hold all buttons to exit</p>
          </Link>
        )}
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
      {/* {controller && ( */}
      <footer>
        <ControllerStatus index={1} />
        <ControllerStatus index={2} />
      </footer>
      {/* )} */}
    </>
  );
}

Layout.defaultProps = {
  back: false,
  // controller: false,
};
