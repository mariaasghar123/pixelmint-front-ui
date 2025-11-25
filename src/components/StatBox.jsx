export default function StatBox({ icon: Icon, value, label }) {
    return (
        <div className="border-[1px] border-border rounded-xl gap-4 px-3 py-2 md:max-w-[220px] w-full flex sm:bg-gray-200 bg-[#98F08C]/50 dark:bg-dark-700" >
            <div className="bg-[#5DD075] dark:bg-[#B8FAE233] p-2 rounded-full">
                <Icon className="w-7 h-7 text-white dark:text-green flex-shrink-0" />
            </div>
            <div>
                <div className=" text-black dark:text-green-100 text-lg font-semibold font-ari ">{value}</div>
                <div className="text-[#002420] dark:text-light text-xs font-sans opacity-70">{label}</div>
            </div>
        </div>
    );
}
