import { useFrappeGetDoc } from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";

function Student() {
   const { id } = useParams();
   const navigate = useNavigate();

   const { data, isLoading } = useFrappeGetDoc("Student", id);

   return (
      <div className="container lg:px-10 py-24">
         {isLoading ? (
            <div className="h-dvh flex justify-center align-middle">
               <div className="loader"></div>
            </div>
         ) : (
            <div id="cardSection" className="px-4 lg:mx-16">
               <div className="flex justify-between">
                  <button
                     className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
                     onClick={() => navigate(-1)}
                  >
                     &lt; Go back
                  </button>
                  <button
                     className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-[#0f6990] text-white transition ease-in-out duration-300"
                     onClick={() => navigate(`/course/${id}`)}
                  >
                     Go To Courses
                  </button>
               </div>
               <div id="personalDetailsCard" className="mb-10">
                  <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-5">
                     Personal Details
                  </h2>
                  <div className="text-gray-800 font-medium mt-5 flex flex-wrap justify-between gap-4 lg:gap-7">
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Full Name :
                        <span className="text-[#0f6990] ms-1">
                           {data.first_name} {data.last_name}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Gender :
                        <span className="text-[#0f6990] ms-1">
                           {data.gender}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Marital Status :
                        <span className="text-[#0f6990] ms-1">
                           {data.marital_status}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Spouse Visa needed :
                        <span className="text-[#0f6990] ms-1">
                           {data.availing_spouse_visa}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Having kids :
                        <span className="text-[#0f6990] ms-1">
                           {data.have_kids}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Preferred Course :
                        <span className="text-[#0f6990] ms-1">
                           {data.preferred_course}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Preferred Country :
                        <span className="text-[#0f6990] ms-1">
                           {data.preferred_country}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Budget :
                        <span className="text-[#0f6990] ms-1">
                           {data.budget}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Availing Scholarship :
                        <span className="text-[#0f6990] ms-1">
                           {data.availing_scholarship == 1 ? "Yes" : "No"}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Religion :
                        <span className="text-[#0f6990] ms-1">
                           {data.religion}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Caste :
                        <span className="text-[#0f6990] ms-1">
                           {data.caste}
                        </span>
                     </p>
                     <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                        Nationality :
                        <span className="text-[#0f6990] ms-1">
                           {data.nationality}
                        </span>
                     </p>
                  </div>
               </div>

               <div id="educationalDetailsCard" className="my-10">
                  <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-8">
                     Educational Details
                  </h2>
                  {/* PHD Section */}
                  {data.phd_course ? (
                     <div id="phdSection">
                        <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                           PHD Qualification
                        </h3>{" "}
                        <div className=" text-gray-800 font-medium flex flex-wrap justify-between  gap-4 lg:gap-7">
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Course :
                              <span className="text-[#0f6990] ms-1">
                                 {data.phd_course}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Institution :
                              <span className="text-[#0f6990] ms-1">
                                 {data.phd_institution}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              University :
                              <span className="text-[#0f6990] ms-1">
                                 {data.phd_board}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Mark :
                              <span className="text-[#0f6990] ms-1">
                                 {data.phd_marks}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Mode of Study :
                              <span className="text-[#0f6990] ms-1">
                                 {data.phd_mode_of_study}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Year of Study :
                              <span className="text-[#0f6990] ms-1">
                                 {data.phd_year_of_study}
                              </span>
                           </p>
                        </div>
                     </div>
                  ) : (
                     ""
                  )}

                  {/* PG Section */}
                  {data.postgraduate_course ? (
                     <div id="postgraduateSection">
                        <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                           Postgraduate Qualification
                        </h3>
                        <div className=" text-gray-800 font-medium flex flex-wrap justify-between  gap-4 lg:gap-7">
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Course :
                              <span className="text-[#0f6990] ms-1">
                                 {data.postgraduate_course}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              University :
                              <span className="text-[#0f6990] ms-1">
                                 {data.postgraduate_institution}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Board :
                              <span className="text-[#0f6990] ms-1">
                                 {data.postgraduate_board}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Mark :
                              <span className="text-[#0f6990] ms-1">
                                 {data.postgraduate_marks}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Mode of Study :
                              <span className="text-[#0f6990] ms-1">
                                 {data.postgraduate_mode_of_study}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Year of Study :
                              <span className="text-[#0f6990] ms-1">
                                 {data.postgraduate_year_of_study}
                              </span>
                           </p>
                        </div>
                     </div>
                  ) : (
                     ""
                  )}

                  {/* UG Section */}
                  {data.undergraduate_course ? (
                     <div id="undergraduateSection">
                        <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                           Undergraduate Qualification
                        </h3>
                        <div className=" text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7">
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Course :
                              <span className="text-[#0f6990] ms-1">
                                 {data.undergraduate_course}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              University :
                              <span className="text-[#0f6990] ms-1">
                                 {data.undergraduate_institution}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Board :
                              <span className="text-[#0f6990] ms-1">
                                 {data.undergraduate_board}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Mark :
                              <span className="text-[#0f6990] ms-1">
                                 {data.undergraduate_marks}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Mode of Study :
                              <span className="text-[#0f6990] ms-1">
                                 {data.undergraduate_mode_of_study}
                              </span>
                           </p>
                           <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                              Year of Study :
                              <span className="text-[#0f6990] ms-1">
                                 {data.undergraduate_year_of_study}
                              </span>
                           </p>
                        </div>
                     </div>
                  ) : (
                     ""
                  )}

                  {/* Twelfth Section */}
                  <div id="twelfthSection" className="mt-5">
                     <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-7">
                        Twelfth Qualification
                     </h3>
                     <div className="text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7">
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Course :
                           <span className="text-[#0f6990] ms-1">
                              {data.twelfth_course}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Institution :
                           <span className="text-[#0f6990] ms-1">
                              {data.twelfth_institution}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Board :
                           <span className="text-[#0f6990] ms-1">
                              {data.twelfth_board}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Mark :
                           <span className="text-[#0f6990] ms-1">
                              {data.twelfth_marks}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Mode of Study :
                           <span className="text-[#0f6990] ms-1">
                              {data.twelfth_mode_of_study}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Year of Study :
                           <span className="text-[#0f6990] ms-1">
                              {data.twelfth_year_of_study}
                           </span>
                        </p>
                     </div>
                  </div>

                  {/* Tenth Section */}
                  <div id="tenthSection" className="mt-10">
                     <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                        Tenth Qualification
                     </h3>
                     <div className=" text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7">
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Course :
                           <span className="text-[#0f6990] ms-1">
                              {data.tenth_course}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Institution :
                           <span className="text-[#0f6990] ms-1">
                              {data.tenth_institution}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Board :
                           <span className="text-[#0f6990] ms-1">
                              {data.tenth_board}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Mark :
                           <span className="text-[#0f6990] ms-1">
                              {data.tenth_marks}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Mode of Study :
                           <span className="text-[#0f6990] ms-1">
                              {data.tenth_mode_of_study}
                           </span>
                        </p>
                        <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                           Year of Study :
                           <span className="text-[#0f6990] ms-1">
                              {data.tenth_year_of_study}
                           </span>
                        </p>
                     </div>
                  </div>
               </div>

               <div id="experienceDetailsCard" className="my-10">
                  {data.internship_details.length > 0 ||
                  data.work_experience.length > 0 ? (
                     <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-8">
                        Experience Details
                     </h2>
                  ) : (
                     ""
                  )}
                  {data.internship_details.length > 0 ? (
                     <div>
                        <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                           Internship Experience
                        </h3>
                        {data.internship_details.map((intern) => (
                           <div
                              key={intern.idx}
                              className="text-base lg:text-[16px] text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7"
                           >
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Intern :
                                 <span className="text-[#0f6990] ms-1">
                                    {intern.intern_position}
                                 </span>
                              </p>
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Company :
                                 <span className="text-[#0f6990] ms-1">
                                    {intern.intern_company_name}
                                 </span>
                              </p>
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Time :
                                 <span className="text-[#0f6990] ms-1">
                                    {intern.intern_from} to {intern.intern_to}
                                 </span>
                              </p>
                           </div>
                        ))}
                     </div>
                  ) : (
                     ""
                  )}
                  {data.work_experience.length > 0 ? (
                     <div>
                        <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 my-3 lg:mt-10">
                           Work Experience
                        </h3>
                        {data.work_experience.map((work) => (
                           <div
                              key={work.idx}
                              className="text-base lg:text-[16px] text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7"
                           >
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Position :
                                 <span className="text-[#0f6990] ms-1">
                                    {work.work_position}
                                 </span>
                              </p>
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Company :
                                 <span className="text-[#0f6990] ms-1">
                                    {work.work_company_name}
                                 </span>
                              </p>
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Time :
                                 <span className="text-[#0f6990] ms-1">
                                    {work.work_from} to {work.work_to}
                                 </span>
                              </p>
                           </div>
                        ))}
                     </div>
                  ) : (
                     ""
                  )}
               </div>

               <div id="languageProficiencyDetailsCard" className="my-10">
                  {data.language_proficiency.length > 0 ? (
                     <div>
                        <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-8">
                           Language Proficiency
                        </h2>
                        {data.language_proficiency.map((language) => (
                           <div
                              key={language.idx}
                              className="text-base lg:text-[16px] text-gray-800 font-medium flex flex-wrap gap-4 lg:gap-16"
                           >
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Language :
                                 <span className="text-[#0f6990] ms-1">
                                    {language.language}
                                 </span>
                              </p>
                              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                                 Certificate :
                                 <span className="text-[#0f6990] ms-1">
                                    {language.certificate}
                                 </span>
                              </p>
                           </div>
                        ))}
                     </div>
                  ) : (
                     ""
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

export default Student;
