import React from 'react'
import ic_eye from '../assets/ic_eye.svg'

const UserTable = () => {
  return (
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                  <tr>
                      {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
                      {/*    Patient ID*/}
                      {/*</th>*/}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                      </th>
                      {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
                      {/*    Age*/}
                      {/*</th>*/}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                      </th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                      {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">24-00001</td>*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">John Drexler</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Cubebe</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">jdgcubebe@bpsu.edu.ph</td>
                      {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">21</td>*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">Active</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="bg-accent-aqua p-1 hover:text-teal-700 rounded-lg">
                              <img src={ic_eye} alt="View" className="h-6 w-6" />
                          </button>
                      </td>
                  </tr>
                  {/* Additional rows can be added here */}
              </tbody>
          </table>
      </div>
  )
}

export default UserTable