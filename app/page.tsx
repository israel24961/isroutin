import Image from 'next/image'
import dynamic from 'next/dynamic'

const LeafletMap = dynamic(() => import('../components/LeafletMap'), {
  ssr: false,
})
// const TicTac = dynamic(() => import('../pages/tictac'), {
//   ssr: false,
// })
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex lg:mb-8">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Did you come from&nbsp;
          <code className="animate-bounce font-mono font-bold"><a href="https://isalt.dev/docs/routing/routing_roadmap.html">isalt.dev</a>&nbsp;</code>?

        </p>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>
      </div>
      <div className="w-full  items-center justify-between font-mono text-sm  ">
      <LeafletMap dark={true} className="mb-4 grid text-center mt-4 lg:mb-0 lg:text-left" />
      </div>
    </main>
  )
}
