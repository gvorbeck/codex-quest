import React from 'react';

interface CantripDescriptionsProps {}

const CantripDescriptions: React.FC<CantripDescriptionsProps & React.ComponentPropsWithRef<"div">> = ({ className }) => {
  return <div className={className}>CantripDescriptions</div>
};

  export default CantripDescriptions;