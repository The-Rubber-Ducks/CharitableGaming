/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  const colors = require('tailwindcss/colors')
  
  module.exports = {
    // ...
    theme: {
      extend: {
        colors: {
          indigo: colors.indigo,
        },
      },
    },
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { ChevronRightIcon, StarIcon } from '@heroicons/react/solid'
import PiggyBank from './assets/piggy-bank.png'
// import ActionFigure from './assets/action-figure.jpg'
import Astronaut from './assets/astronaut.mp4'

const stats = [
  { label: 'Founded', value: '2021' },
  { label: 'Employees', value: '5' },
  { label: 'Beta Users', value: '521' },
  { label: 'Raised', value: '$25M' },
]
const logos = [
  { name: 'Transistor', url: 'https://tailwindui.com/img/logos/transistor-logo-gray-400.svg' },
  { name: 'Mirage', url: 'https://tailwindui.com/img/logos/mirage-logo-gray-400.svg' },
  { name: 'Tuple', url: 'https://tailwindui.com/img/logos/tuple-logo-gray-400.svg' },
  { name: 'Laravel', url: 'https://tailwindui.com/img/logos/laravel-logo-gray-400.svg' },
  { name: 'StaticKit', url: 'https://tailwindui.com/img/logos/statickit-logo-gray-400.svg' },
  { name: 'Workcation', url: 'https://tailwindui.com/img/logos/workcation-logo-gray-400.svg' },
]


export default function Home() {
  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
            <div>
              <div>
                <img
                  className="h-11 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                  alt="Workflow"
                />
              </div>
              <div className="mt-20">
                <div>
                  <a href="#" className="inline-flex space-x-4">
                    <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-500 tracking-wide uppercase">
                      Currently in private beta
                    </span>
                    <span className="inline-flex items-center text-sm font-medium text-indigo-500 space-x-1">
                      <span>By invitation only</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </a>
                </div>
                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Video games for good
                  </h1>
                  <p className="mt-6 text-xl text-gray-500">
                    Who says playing video games is a waste of time? They probably haven't seen how our users are helping to make the world a better place.
                  </p>
                </div>
                <form action="#" className="mt-12 sm:max-w-lg sm:w-full sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="hero-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      className="block w-full border border-gray-300 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-10"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
                <div className="mt-6">
                  <div className="inline-flex items-center divide-x divide-gray-300">
                    <div className="flex-shrink-0 flex pr-5">
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 pl-5 py-1 text-sm text-gray-500 sm:py-3">
                      <span className="font-medium text-gray-900">Rated 5 stars</span> by over{' '}
                      <span className="font-medium text-indigo-500">500 beta users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hidden sm:block">
                <div />
                <svg
                  className="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
                  width={700}
                  height={900}
                  fill="none"
                  viewBox="0 0 700 900"
                >
                  <defs>
                    <pattern
                      id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width={700} height={900} fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
                </svg>
              </div>
              <div className="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                <img
                  className="w-full rounded-md lg:h-full lg:w-auto lg:max-w-none"
                  src={PiggyBank}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial/stats section */}
        <div className="relative mt-20">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
            <div className="relative sm:py-16 lg:py-0">
              <div aria-hidden="true" className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen">
                <div className="absolute inset-y-0 right-1/2 w-full bg-gray-50 rounded-r-3xl lg:right-72" />
                <svg
                  className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                  width={700}
                  height={900}
                  fill="none"
                  viewBox="0 0 700 900"
                >
                  <defs>
                    <pattern
                      id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width={700} height={900} fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)" />
                </svg>
              </div>
              <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20">
                {/* Testimonial card*/}
                <div className="relative pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src='assets/astronaut.mp4'
                    alt=""
                  />
                  <div className="absolute inset-0 bg-indigo-100 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-600 opacity-90" />
                  <div className="relative px-8">
                    <div>
                      <img
                        className="h-12"
                        src="https://tailwindui.com/img/logos/workcation.svg?color=white"
                        alt="Workcation"
                      />
                    </div>
                    <blockquote className="mt-8">
                      <div className="relative text-lg font-medium text-white md:flex-grow">
                        <svg
                          className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-indigo-400"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative">
                          Tincidunt integer commodo, cursus etiam aliquam neque, et. Consectetur pretium in volutpat,
                          diam. Montes, magna cursus nulla feugiat dignissim id lobortis amet.
                        </p>
                      </div>

                      <footer className="mt-4">
                        <p className="text-base font-semibold text-indigo-200">Sarah Williams, CEO at Workcation</p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
              {/* Content area */}
              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h2 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
                  On a mission to empower teams
                </h2>
                <div className="mt-6 text-gray-500 space-y-6">
                  <p className="text-lg">
                    Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque
                    tristique pellentesque. Blandit amet, sed aenean erat arcu morbi. Cursus faucibus nunc nisl netus
                    morbi vel porttitor vitae ut. Amet vitae fames senectus vitae.
                  </p>
                  <p className="text-base leading-7">
                    Sollicitudin tristique eros erat odio sed vitae, consequat turpis elementum. Lorem nibh vel, eget
                    pretium arcu vitae. Eros eu viverra donec ut volutpat donec laoreet quam urna. Sollicitudin
                    tristique eros erat odio sed vitae, consequat turpis elementum. Lorem nibh vel, eget pretium arcu
                    vitae. Eros eu viverra donec ut volutpat donec laoreet quam urna.
                  </p>
                  <p className="text-base leading-7">
                    Rhoncus nisl, libero egestas diam fermentum dui. At quis tincidunt vel ultricies. Vulputate aliquet
                    velit faucibus semper. Pellentesque in venenatis vestibulum consectetur nibh id. In id ut tempus
                    egestas. Enim sit aliquam nec, a. Morbi enim fermentum lacus in. Viverra.
                  </p>
                </div>
              </div>

              {/* Stats section */}
              <div className="mt-10">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {stats.map((stat) => (
                    <div key={stat.label} className="border-t-2 border-gray-100 pt-6">
                      <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                      <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-10">
                  <a href="#" className="text-base font-medium text-indigo-500">
                    Learn more about how we're changing the world&rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo cloud section */}
        <div className="mt-32">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                  Backed by world-renowned investors
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque
                  tristique pellentesque. Blandit amet, sed aenean erat arcu morbi. Cursus faucibus nunc nisl netus
                  morbi vel porttitor vitae ut. Amet vitae fames senectus vitae.
                </p>
                <div className="mt-6">
                  <a href="#" className="text-base font-medium text-indigo-500">
                    Meet our investors and advisors&rarr;
                  </a>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                {logos.map((logo) => (
                  <div key={logo.name} className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                    <img className="max-h-12" src={logo.url} alt={logo.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative mt-24 sm:mt-32 sm:py-16">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
            <svg className="absolute top-8 left-1/2 -ml-3" width={700} height={600} fill="none" viewBox="0 0 700 900">
              <defs>
                <pattern
                  id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={900} height={400} fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)" />
            </svg>
          </div>
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative rounded-2xl px-6 py-10 bg-indigo-500 overflow-hidden shadow-xl sm:px-12 sm:py-20">
              <div aria-hidden="true" className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0">
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 1463 360"
                >
                  <path
                    className="text-indigo-400 text-opacity-40"
                    fill="currentColor"
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                  />
                  <path
                    className="text-indigo-900 text-opacity-40"
                    fill="currentColor"
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                  />
                </svg>
              </div>
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Get notified when we&rsquo;re launching.
                  </h2>
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-100">
                    Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque
                    tristique pellentesque.
                  </p>
                </div>
                <form action="#" className="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-gray-900 text-base font-medium text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 sm:px-10"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  )
}
