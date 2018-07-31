def addTwo(l_1: ListNode, l_2: ListNode): ListNode = {
    val dummyHead = ListNode(1)
    addNodes(dummyHead, l_1, l_2, 0)
    dummyHead.next
}

def addNodes(headNode: ListNode, l_1: ListNode, l_2: ListNode, carry: Int): Unit = {
    (l_1, l_2) match {
        case (null, null) => {
            if (carry == 1) headNode.next = ListNode(1)
            Unit  
        }
        case _ => {
            val (value1, nextL_1) = l_1 match {
                case null => (0, null)
                case _ => (l_1.x, l_1.next)
            }
            val (value2, nextL_2) = l_2 match {
                case null => (0, null)
                case _ => (l_2.x, l_2.next)
            }
            val nextNode = ListNode((value1+value2+carry)%10)
            val nextCarry = (value1 + value2 + carry)/10
            headNode.next = nextNode
            addNodes(nextNode, nextL_1, nextL_2, nextCarry)
        }
    }
}