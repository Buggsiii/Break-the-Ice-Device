import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack as BackIcon } from 'react-icons/io';

export default function Layout({
  children,
  title,
  back: useBack = false,
}: {
  children: React.ReactNode;
  title: string;
  back?: boolean;
}) {
  return (
    <>
      <header>
        {useBack && (
          <Link to="/">
            <BackIcon size={24} />
            <p>Hold all buttons to exit</p>
          </Link>
        )}
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
    </>
  );
}

Layout.defaultProps = {
  back: false,
};
