import React from 'react';
import aboutImg from "../../assets/images/about.png";
import aboutImgCard from "../../assets/images/about-card.png";
import { Link } from 'react-router-dom';

const About = () => {
  return <sectiom>
    <div className='container'>
        <div className='flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row'>
            {/* =====about image===== */}
            <div className='relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1'>
                <img src={aboutImg} alt=''/>
                <div className='absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-7%]
                lg:right-[22%]'>
                    <img src={aboutImgCard} alt=''/>
                </div>
            </div>

            {/* =====about content===== */}
            <div className='w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2'>
                <h2 className='heading'> Proud to be one of Nations Best</h2>
                <p className='text__para'>
                When it comes to choosing a hospital, one thing is clear: quality counts. 
                With more than two decades of tradition, excellence and quality in providing 
                medical care in a comfortable and convenient environment
                </p>
                <p className='text__para mt-[30px]'>
                Better Health Care through a Good Hospital Pharmacy service. Pharmacy of NMH are 
                experts in rational drug therapy for a speedier cure and faster recovery. 
                </p>
                <Link to="/">
                    <button className='btn'>Learn More</button>
                </Link>
            </div>
        </div>
    </div>
  </sectiom>
}

export default About