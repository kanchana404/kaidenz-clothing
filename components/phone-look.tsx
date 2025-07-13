import React from 'react'
import { Safari } from './magicui/safari'

const PhoneLook = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] py-12 gap-8">
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 px-2 sm:px-4 md:px-8">
                {/* Safari Web Preview - left, takes most width */}
                <div className="flex-1 flex items-center justify-start w-full max-w-5xl aspect-[1203/753]">
                    <Safari
                        url="magicui.design"
                        className="w-full h-full drop-shadow-lg"
                        width={1203}
                        height={753}
                        imageSrc="/safari.png"
                    />
                </div>
              
            </div>
            {/* Message Row */}
            <div className="w-full flex justify-center mt-8">
                <div className="bg-[#f6f6f6] rounded-xl  px-8 py-6 flex flex-col items-center max-w-2xl">
                    <span className="text-lg sm:text-xl font-semibold text-[#111111] text-center font-mono">
                        Visit us on <span className="text-[#ffcb74] font-bold">mobile</span> and <span className="text-[#ffcb74] font-bold">web browser</span> also on our webpage.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PhoneLook