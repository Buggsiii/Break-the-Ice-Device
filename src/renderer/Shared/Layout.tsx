import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack as BackIcon } from 'react-icons/io';
import ControllerStatus from '../Components/ControllerStatus';
import Input from '../input';
import { OneContext } from './Contexts';

export default function Layout({
  children,
  title,
  back = false,
}: {
  children: React.ReactNode;
  title: string;
  back?: boolean;
}) {
  const backRef = React.useRef<HTMLAnchorElement>(null);
  const oneConnected = React.useContext(OneContext);

  useEffect(() => {
    const inputOne = new Input('one');
    inputOne.InputEvent.on('back', () => backRef.current?.click());

    return () => {
      inputOne.InputEvent.removeAllListeners();
    };
  }, []);

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
      <footer>
        <ControllerStatus connected={oneConnected} />
      </footer>
    </>
  );
}

Layout.defaultProps = {
  back: false,
};
