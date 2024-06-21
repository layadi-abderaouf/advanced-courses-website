export const Header = () => {
    return (
      <div className="relative bg3 bg-deep-purple-accent-400">
        <div className="absolute inset-x-0 bottom-0">
          <svg
            viewBox="0 0 224 12"
            fill="currentColor"
            className="w-full -mb-1 text-white"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z" />
          </svg>
        </div>
        <div className="px-2 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-18 lg:px-4 lg:py-16">
          <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
            <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-white sm:text-3xl sm:leading-none">
              welcome to
              <br className="hidden md:block" />
             {' '}
              <span className="relative inline-block px-2">
                <div className="absolute inset-0 transform -skew-x-12 bg bg-teal-accent-400" />
                <span className="relative text-white ">Champ Academy</span>
              </span>
            </h2>
            <p className="mb-6 text-base text-indigo-100 md:text-lg">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae. explicabo. Sed ut perspiciatis unde omnis.
            </p>
          
            <div className="flex justify-between mb-2" >
                <a href="/courses" className="p-4 bg-white text-black rounded-xl flex-1" >Discover our courses</a>
                <a href="/" className="p-4 bg-white text-black rounded-xl flex-1 ml-4" > Encyclopedia</a>
                <a href="/register" className="p-4 bg-white text-black rounded-xl ml-4 flex-1" >Sign Up</a>
            </div>
            <a
              href="/"
              aria-label="Scroll down"
              className="flex items-center justify-center w-8 h-8 mx-auto text-white duration-300 transform border border-gray-400 rounded-full hover:text-teal-accent-400 hover:border-teal-accent-400 hover:shadow hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  };